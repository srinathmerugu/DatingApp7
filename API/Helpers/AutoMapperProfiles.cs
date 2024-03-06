using API.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            /*
            CreateMap<Source, Destination> - Creates a mapping configuration from the AppUser type to the MemberDto type
            ForMember() - Configure for destMember when the property you want to map isn't known for AutoMapper to find during compile time
            Here below we're trying to map PhotoUrl property for MemberDto from User class photos array[], where we are looping in photos[]
            to find the main photo and returning main photo's URL
            */
            CreateMap<AppUser, MemberDto>().ForMember(dest => dest.PhotoUrl,
            options => options.MapFrom(src => src.Photos.FirstOrDefault(photo => photo.IsMain).Url))
            .ForMember(dest => dest.Age, options => options.MapFrom(src => src.DateOfBirth.CalculateAge()));
            CreateMap<Photo, PhotoDto>();
        }
    }
}